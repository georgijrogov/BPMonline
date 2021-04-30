namespace Terrasoft.Configuration.IteLessonDurationService
{
	using System;
	using System.Linq;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Entities;
	using Terrasoft.Common;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class IteLessonDurationService: BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public int GetDurationLinq(Guid programId)
		{
			if (programId == Guid.Empty)
			{
				return -1;
			}
			
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "IteSwimmingLesson");
			var lessonDurationCol = esq.AddColumn("IteDuration");
			var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "IteProgram.Id", programId);
			esq.Filters.Add(esqFilter);
			var entities = esq.GetEntityCollection(UserConnection);
			
			int overallDuration = entities.Select(x => x.GetTypedColumnValue<int>(lessonDurationCol.Name)).Sum();

			return entities.Count != 0 ? overallDuration : -1;
		}
		
		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public int GetDuration(Guid programId)
		{
			if (programId == Guid.Empty)
			{
				return -1;
			}
			
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "IteSwimmingLesson")
			{
				PrimaryQueryColumn = { IsAlwaysSelect = true, SummaryType = AggregationType.Count }
			};
			var lessonDurationCol = esq.AddColumn("IteDuration");
			lessonDurationCol.SummaryType = AggregationType.Sum;
			var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "IteProgram.Id", programId);
			esq.Filters.Add(esqFilter);
			Entity summaryEntity = esq.GetSummaryEntity(UserConnection);
			int overallDuration = summaryEntity.GetTypedColumnValue<int>(lessonDurationCol.Name);

			return summaryEntity.GetTypedColumnValue<int>(esq.PrimaryQueryColumn.Name) != 0 ? overallDuration : -1;
		}
	}
}