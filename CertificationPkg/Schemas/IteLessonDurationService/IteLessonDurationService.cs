namespace Terrasoft.Configuration.IteLessonDurationService
{
	using System;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Entities; 

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class IteLessonDurationService: BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public string GetDuration(string ProgramId)
		{
			var result = "";
			TimeSpan overallDuration = new TimeSpan(0, 0, 0);
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "IteSwimmingLesson");
			var colLessonDuration = esq.AddColumn("IteDuration");
			var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "IteProgram.Id", ProgramId);
			esq.Filters.Add(esqFilter);
			var entities = esq.GetEntityCollection(UserConnection);
			
			foreach (var entity in entities)
			{
				overallDuration = overallDuration + entity.GetTypedColumnValue<TimeSpan>(colLessonDuration.Name);
			}
			result = overallDuration.ToString();
			
			if (entities.Count == 0)
			{
				result = "-1";
			}
			
			return result;
		}
	}
}